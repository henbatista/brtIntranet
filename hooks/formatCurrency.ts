function formatCurrency(value: any) {
    if (isNaN(value)) {
        return "";
    }

    const toNumber = Number(value);
    if (!toNumber) return "";

    const cents = value.padStart(2, "0");
    const integer = cents.slice(0, -2) || "0";
    const decimal = cents.slice(-2);

    let formatInteger = "";

    for (let i = integer.length - 1, j = 0; i >= 0; i--, j <= 8, j++) {
        if (j > 0 && j % 3 === 0) {
            formatInteger = "." + formatInteger;
        }
        formatInteger = integer[i] + formatInteger;
    }
    formatInteger = formatInteger.replace(/^0+/, "");

    if (formatInteger === "") {
        formatInteger = "00";
    } else if (formatInteger.length === 1) {
        formatInteger = "0" + formatInteger;
    }

    return "R$ " + formatInteger + "," + decimal;
}

export const inputCurrencyMask = (input: any) => {
    const value = input.target.value.replace(/\D/g, "");
    input.target.value = formatCurrency(value);
};

export const fixNumber = (value: string | number) => {
    if (typeof value === "string") {
        let changeValue = value;

        changeValue = changeValue.replace("R$ ", "");

        if (
            (changeValue as string).includes(".") &&
            (changeValue as string).includes(",")
        ) {
            return Number(changeValue.replaceAll(".", "").replace(",", "."));
        } else if ((changeValue as string).includes(",")) {
            return Number(changeValue.replace(",", "."));
        }

        return Number(changeValue);
    }

    return value;
};
