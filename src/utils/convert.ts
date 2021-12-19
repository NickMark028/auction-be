export function convertProcedureRowSetToList(rows: [][]) {
    return Object.values(JSON.parse(JSON.stringify(rows)))[0] as object[];
}
