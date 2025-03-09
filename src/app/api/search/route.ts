export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const siteUrl = searchParams.get("url");
    const text = searchParams.get("text");
    const crawlType = searchParams.get("crawlType");
    const crawlWholeSite = searchParams.get("crawlWholeSite") === "true";

    if (!siteUrl || !text) {
        return Response.json({ status: "error", results: [], message: "Missing parameters" }, { status: 400 });
    }

    try {
        console.log(`Starting crawl for: ${siteUrl}`);

        const robotsUrl = new URL("/robots.txt", siteUrl).href;
        const robotsResponse = await fetch(robotsUrl);

        if (!robotsResponse.ok) {
            return Response.json({ status: "error", results: [], message: "Failed to fetch robots.txt" }, { status: 500 });
        }

        const robotsText = await robotsResponse.text();
        const sitemapMatch = robotsText.match(/Sitemap:\s*(.+)/i);
        if (!sitemapMatch) {
            return Response.json({ status: "error", results: [], message: "No sitemap found in robots.txt" }, { status: 404 });
        }

        const sitemapUrl = sitemapMatch[1].trim();
        const sitemapResponse = await fetch(sitemapUrl);
        if (!sitemapResponse.ok) {
            return Response.json({ status: "error", results: [], message: "Failed to fetch sitemap" }, { status: 500 });
        }

        const sitemapText = await sitemapResponse.text();
        const urlMatches = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)];
        let urls = urlMatches.map(match => match[1]);

        if (urls.length === 0) {
            return Response.json({ status: "error", results: [], message: "No URLs found in sitemap" }, { status: 404 });
        }

        // If not crawling the whole site, limit to only the first URL
        if (!crawlWholeSite) {
            urls = [siteUrl];
        }

        console.log(`Total URLs found: ${urls.length}`);

        const MAX_CONCURRENT_REQUESTS = 5;
        const RETRY_DELAY_MS = 5000;
        const matchingUrls: string[] = [];
        let processedCount = 0;

        async function fetchWithRetry(url: string, retries = 3): Promise<string | null> {
            for (let attempt = 0; attempt < retries; attempt++) {
                try {
                    const pageResponse = await fetch(url, {
                        method: "GET",
                        headers: { "User-Agent": "Mozilla/5.0 (compatible; MyCrawler/1.0)" }
                    });

                    if (pageResponse.ok) {
                        if (crawlType === 'Keyword') {
                            const pageText = await pageResponse.text();
                            if (text && pageText.includes(text)) {
                                return url;
                            }
                        }
                        return null;
                    }

                    if (pageResponse.status === 429) {
                        const retryAfter = pageResponse.headers.get("Retry-After");
                        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS;
                        console.warn(`Rate limited. Retrying ${url} after ${waitTime}ms...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    } else {
                        console.error(`Error fetching ${url}: ${pageResponse.status}`);
                        return null;
                    }
                } catch (error) {
                    console.error(`Error fetching ${url}:`, error);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                }
            }
            return null;
        }

        async function processBatch(urlsBatch: string[]) {
            console.log(`Processing batch of ${urlsBatch.length} URLs...`);
            const promises = urlsBatch.map(url => fetchWithRetry(url));
            const results = await Promise.allSettled(promises);

            results.forEach(result => {
                if (result.status === "fulfilled" && result.value) {
                    matchingUrls.push(result.value);
                }
                processedCount++;
                console.log(`Processed ${processedCount}/${urls.length} URLs...`);
            });
        }

        for (let i = 0; i < urls.length; i += MAX_CONCURRENT_REQUESTS) {
            const batch = urls.slice(i, i + MAX_CONCURRENT_REQUESTS);
            await processBatch(batch);
        }
        console.log(`Final Results Found: ${matchingUrls}`);
        return Response.json({ status: "success", results: matchingUrls, message: matchingUrls.length > 0 ? (crawlWholeSite ? "Results fetched successfully": "Searched Phrase Exist") : "No match found" });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Unexpected error:", error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        return Response.json({ status: "error", results: [], message: "Unexpected error occurred" }, { status: 500 });
    }
}
