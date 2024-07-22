import { omit } from "lodash";
import { ref } from "vue";

interface handleErrorProp {
    inner: {
        message: string;
        path: string;
    }[];
}

type ConvertToString<T> = {
    [K in keyof T]: T[K] extends infer U
        ? U extends string
            ? string
            : U
        : never;
};

//Criação da referência do erro
const errors = ref({});

const formatNestedObject = (path: string, value: string | number) => {
    const entries = path.split(".");
    let nested: any = {};

    entries.reduce((obj: any, key, index) => {
        if (index === entries.length - 1) {
            obj[key] = value;
        } else {
            obj[key] = obj[key] || {};
        }
        return obj[key];
    }, nested);

    return nested;
};

const groupObjectKeys = <T extends Object = any>(data: Array<T>) => {
    const groupedData: any = {};

    data.forEach((item) => {
        const [key, value] = Object.entries(item)[0];

        if (!(key in groupedData) || typeof groupedData[key] !== "object") {
            groupedData[key] = value; // Assumindo que value seja uma string de erro
        } else {
            Object.assign(groupedData[key], value);
        }
    });

    return groupedData;
};

//Formatando os erros para distribuir para os inputs
const handleError = (error: handleErrorProp, form: any | null) => {
    const { inner } = error;

    if (!inner?.length) return;

    const mapErrors = inner?.map((e) => formatNestedObject(e.path, e.message));
    const groupErrorsByKey = groupObjectKeys(mapErrors);

    errors.value = groupErrorsByKey;

    form.scrollIntoView({ behavior: "smooth" });
};

const deletePropertyPath = (obj: globalThis.Ref, path: string | string[]) => {
    if (!obj.value || !path) {
        return;
    }
    obj.value = omit(obj.value, path);
};

//Hook de validação
const useFormValidation = <Data extends object = {}>(
    schema: any,
    data: Data
) => {
    //Validação do form, aqui ele passa por cada um dos
    //campos e retorna erro caso o campo não seja validado
    const validateSubmit = (formEvent: Event) => {
        try {
            schema.validateSync(data, {
                abortEarly: false,
            });

            return data;
        } catch (error: any) {
            const { target } = formEvent;

            handleError(error, target);
            console.log(errors.value);
            throw error;
        }
    };

    //Validação do input após ser atribuido o erro a ele
    const inputValidate = async (field: string) => {
        await schema.validateAt(field, data).then((valid: any) => {
            //Verificando se o input já foi validado e excluindo ele da lista de erros
            if (valid) {
                deletePropertyPath(errors, field as string);
            }
        });
    };

    return {
        errors: errors as globalThis.Ref<ConvertToString<Data>>,
        validateSubmit,
        inputValidate,
    };
};

export default useFormValidation;
