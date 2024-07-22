import { forEach } from "lodash";

export const useBuildParams = (data: Object) => {
    let params = new URLSearchParams("");

    forEach(data, (e: any, i) => {
        let paramsKey: string[] = [];

        for (const key of params.keys()) {
            paramsKey = [...paramsKey, key];
        }

        if (paramsKey.includes(i)) {
            if (!e) {
                params.delete(i);
                return;
            }

            params.set(i, e);
        } else {
            params.append(i, e);
        }
    });

    return "?" + params.toString();
};
