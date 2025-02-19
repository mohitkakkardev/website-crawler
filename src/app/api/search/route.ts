export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const siteUrl = searchParams.get("url");
    const text = searchParams.get("text");

    if (!siteUrl || !text) {
        return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        // Step 1: Fetch the robots.txt file to find the sitemap
        const robotsUrl = new URL("/robots.txt", siteUrl).href;
        const robotsResponse = await fetch(robotsUrl);

        if (!robotsResponse.ok) {
            return Response.json({ error: "Failed to fetch robots.txt" }, { status: 500 });
        }

        const robotsText = await robotsResponse.text();
        const sitemapMatch = robotsText.match(/Sitemap:\s*(.+)/i);
        if (!sitemapMatch) {
            return Response.json({ error: "No sitemap found in robots.txt" }, { status: 404 });
        }

        const sitemapUrl = sitemapMatch[1].trim();

        // Step 2: Fetch all URLs from the sitemap
        const sitemapResponse = await fetch(sitemapUrl);
        if (!sitemapResponse.ok) {
            return Response.json({ error: "Failed to fetch sitemap" }, { status: 500 });
        }

        const sitemapText = await sitemapResponse.text();
        const urlMatches = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)];
        const urls = urlMatches.map(match => match[1]);

        if (urls.length === 0) {
            return Response.json({ error: "No URLs found in sitemap" }, { status: 404 });
        }

        // Step 3: Process URLs in batches with controlled concurrency
        const BATCH_SIZE = 10; // Number of concurrent requests at a time
        const matchingUrls: string[] = [];

        async function processBatch(batch: string[]) {
            const results = await Promise.allSettled(
                batch.map(async (url) => {
                    try {
                        const pageResponse = await fetch(url, { method: "GET" });
                        if (pageResponse.ok) {
                            const pageText = await pageResponse.text();
                            if (pageText.includes(text)) {
                                return url;
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
                    matchingUrls.push(result.value);
                }
            });
        }

        // Process URLs in batches
        for (let i = 0; i < urls.length; i += BATCH_SIZE) {
            const batch = urls.slice(i, i + BATCH_SIZE);
            await processBatch(batch);
        }

        return Response.json({ results: matchingUrls });
    } catch (error) {
        return Response.json({ error: "Unexpected error occurred" }, { status: 500 });
    }
}
