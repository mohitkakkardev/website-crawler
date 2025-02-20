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

        const BATCH_SIZE = 10;
        const matchingUrls: string[] = [];

        async function processBatch(batch: string[]) {
            const results = await Promise.allSettled(
                batch.map(async (url) => {
                    try {
                        const pageResponse = await fetch(url, { method: "GET" });
                        if (pageResponse.ok) {
                            if (crawlType == 'Text') {
                                const pageText = await pageResponse.text();
                                if (text && pageText.includes(text)) {
                                    return url;
                                } else {
                                    return null;
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching ${url}:`, error);
                    }
                    return null;
                })
            );

            results.forEach((result) => {
                if (result.status === "fulfilled" && result.value) {
                    if (typeof result.value === 'string') {
                        matchingUrls.push(result.value);
                    }
                }
            });
        }

        for (let i = 0; i < urls.length; i += BATCH_SIZE) {
            const batch = urls.slice(i, i + BATCH_SIZE);
            await processBatch(batch);
        }

        return Response.json({ status: "success", results: matchingUrls, message: matchingUrls.length > 0 ? (crawlWholeSite ? "Results fetched successfully" : "Match Found!") : "No match found" });
    } catch (error) {
        return Response.json({ status: "error", results: [], message: "Unexpected error occurred" }, { status: 500 });
    }
}
