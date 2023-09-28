export const typeHelpers = {
    "exists": function (v: unknown) {
        return v !== undefined && v !== null;
    },
    "to-bool": function (v: unknown) {
        if (typeof v === "boolean") {
            return v;
        }

        if (typeof v === "string") {
            const l = v.toLowerCase();
            if (l === "true" || l === "1" || l === "yes") {
                return true;
            }

            return false;
        }

        if (typeof v === "number") {
            return v > 0;
        }

        return false;
    },
};
