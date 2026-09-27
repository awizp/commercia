class APIHelper {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Search by product name (case-insensitive)
    search() {
        const keyword = this.queryStr.keyword
            ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    // Filter by category and price range without double-encoding operator keys
    filter() {
        const queryCopy = { ...this.queryStr };

        // Exclude pagination & search params
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Explicit price range handling
        const minPrice = this.queryStr.minPrice ? Number(this.queryStr.minPrice) : null;
        const maxPrice = this.queryStr.maxPrice ? Number(this.queryStr.maxPrice) : null;

        delete queryCopy.minPrice;
        delete queryCopy.maxPrice;

        // If bracket format like price[gte] or price[lte] came in
        if (queryCopy.price && typeof queryCopy.price === "object") {
            const formattedPrice = {};
            for (const key in queryCopy.price) {
                const operator = key.startsWith("$") ? key : `$${key}`;
                formattedPrice[operator] = Number(queryCopy.price[key]);
            }
            queryCopy.price = formattedPrice;
        } else if (minPrice !== null || maxPrice !== null) {
            queryCopy.price = {};
            if (minPrice !== null) queryCopy.price.$gte = minPrice;
            if (maxPrice !== null) queryCopy.price.$lte = maxPrice;
        }

        this.query = this.query.find(queryCopy);
        return this;
    }

    // Pagination helper
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default APIHelper;