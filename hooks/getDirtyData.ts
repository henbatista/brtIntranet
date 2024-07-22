export const getDirtData = <T extends Object = {}>(data: T, dirtyData: T) => {
    const dataKeys = Object.keys(data);

    const filterDirtyData = dataKeys
        .map((e) => {
            if (data[e as keyof T] != dirtyData[e as keyof T]) {
                return {
                    [e]: dirtyData[e as keyof T],
                };
            }
        })
        .filter((filter) => filter);

    return Object.assign({}, ...filterDirtyData);
};
