import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: string | Date, options = "dd/MM/yyyy") => {
    try {
        let newDate = new Date(date);

        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (typeof date === "string" && date.includes("T00:00:00.000Z")) {
            const [dateOnly] = date.split("T");

            const [year, month, day] = dateOnly.split("-");
            newDate = new Date(Number(year), Number(month) - 1, Number(day));
        } else if (regex.test(date as string)) {
            const [year, month, day] = (date as string).split("-");
            newDate = new Date(Number(year), Number(month) - 1, Number(day));
        }

        return format(newDate, options, {
            locale: ptBR,
        });
    } catch (error) {
        return "Data inválida";
    }
};
