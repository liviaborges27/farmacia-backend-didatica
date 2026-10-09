import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Produto {
    private idProduto?: number;
    private descricao: string;
    private validade?: Date | null;
    private preco: number;
    private qtdEstoque: number;
    private qtdMinEstoque: number;

    constructor(
        _descricao: string,
        _preco: number,
        _qtdEstoque: number,
        _qtdMinEstoque: number,
        _validade?: Date | null
    ) {
        this.descricao = _descricao;
        this.preco = _preco;
        this.qtdEstoque = _qtdEstoque;
        this.qtdMinEstoque = _qtdMinEstoque;
        this.validade = _validade ?? null;
    }

    // ========== GETTERS ==========
    public getIdProduto(): number | undefined { return this.idProduto; }
    public getDescricao(): string { return this.descricao; }
    public getValidade(): Date | null | undefined { return this.validade; }
    public getPreco(): number { return this.preco; }
    public getQtdEstoque(): number { return this.qtdEstoque; }
    public getQtdMinEstoque(): number { return this.qtdMinEstoque; }

    // ========== SETTERS ==========
    public setIdProduto(v: number): void { this.idProduto = v; }
    public setDescricao(v: string): void { this.descricao = v; }
    public setValidade(v: Date | null | undefined): void { this.validade = v ?? null; }
    public setPreco(v: number): void { this.preco = v; }
    public setQtdEstoque(v: number): void { this.qtdEstoque = v; }
    public setQtdMinEstoque(v: number): void { this.qtdMinEstoque = v; }

    // CREATE
    static async cadastrarProduto(produto: Produto): Promise<boolean> {
        try {
            const query = `
                INSERT INTO produto (descricao, validade, preco, qtd_estoque, qtd_min_estoque)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_produto;
            `;
            const params = [
                produto.descricao.toUpperCase(),
                produto.validade,
                produto.preco,
                produto.qtdEstoque,
                produto.qtdMinEstoque
            ];
            const result = await database.query(query, params);

            if (result.rows.length > 0) {
                console.log(`Produto cadastrado. ID: ${result.rows[0].id_produto}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

    // LISTAR TODOS
    static async listarTodosProdutos(): Promise<Array<{
        idProduto: number;
        descricao: string;
        validade: Date | null;
        preco: number;
        qtdEstoque: number;
        qtdMinEstoque: number;
        emAlerta: boolean;
    }>> {
        try {
            const query = `
                SELECT 
                  p.id_produto       AS "idProduto",
                  p.descricao        AS "descricao",
                  p.validade         AS "validade",
                  p.preco            AS "preco",
                  p.qtd_estoque      AS "qtdEstoque",
                  p.qtd_min_estoque  AS "qtdMinEstoque",
                  COALESCE(v.em_alerta, FALSE) AS "emAlerta"
                FROM produto p
                LEFT JOIN v_produtos_alerta v
                       ON v.id_produto = p.id_produto
                ORDER BY p.id_produto;
            `;
            const result = await database.query(query);
            return result.rows as any;
        } catch (error) {
            console.error(`Erro ao listar produtos: ${error}`);
            return [];
        }
    }

    // OBTER POR ID
    static async obterProdutoPorId(idProduto: number): Promise<{
        idProduto: number;
        descricao: string;
        validade: Date | null;
        preco: number;
        qtdEstoque: number;
        qtdMinEstoque: number;
    } | null> {
        try {
            const query = `
                SELECT 
                  id_produto      AS "idProduto",
                  descricao       AS "descricao",
                  validade        AS "validade",
                  preco           AS "preco",
                  qtd_estoque     AS "qtdEstoque",
                  qtd_min_estoque AS "qtdMinEstoque"
                FROM produto 
                WHERE id_produto = $1;
            `;
            const result = await database.query(query, [idProduto]);
            if (result.rows.length > 0) {
                return result.rows[0] as any;
            }
            return null;
        } catch (error) {
            console.error(`Erro ao buscar produto por ID: ${error}`);
            return null;
        }
    }

    // LISTAR EM ALERTA
    static async listarProdutosEmAlerta(): Promise<Array<{
        idProduto: number;
        descricao: string;
        qtdEstoque: number;
        qtdMinEstoque: number;
        emAlerta: boolean;
    }>> {
        try {
            const query = `
                SELECT 
                  v.id_produto       AS "idProduto",
                  v.descricao        AS "descricao",
                  v.qtd_estoque      AS "qtdEstoque",
                  v.qtd_min_estoque  AS "qtdMinEstoque",
                  v.em_alerta        AS "emAlerta"
                FROM v_produtos_alerta v
                ORDER BY v.id_produto;
            `;
            const result = await database.query(query);
            return result.rows as any;
        } catch (error) {
            console.error(`Erro ao listar produtos em alerta: ${error}`);
            return [];
        }
    }

    // UPDATE
    static async atualizarProduto(
        idProduto: number,
        campos: Partial<{
            descricao: string;
            validade: Date | null;
            preco: number;
            qtdEstoque: number;
            qtdMinEstoque: number;
        }>
    ): Promise<boolean> {
        try {
            const sets: string[] = [];
            const params: any[] = [];
            let idx = 1;

            if (campos.descricao !== undefined) {
                sets.push(`descricao = $${idx++}`);
                params.push(campos.descricao.toUpperCase());
            }
            if (campos.validade !== undefined) {
                sets.push(`validade = $${idx++}`);
                params.push(campos.validade);
            }
            if (typeof campos.preco === "number") {
                sets.push(`preco = $${idx++}`);
                params.push(campos.preco);
            }
            if (typeof campos.qtdEstoque === "number") {
                sets.push(`qtd_estoque = $${idx++}`);
                params.push(campos.qtdEstoque);
            }
            if (typeof campos.qtdMinEstoque === "number") {
                sets.push(`qtd_min_estoque = $${idx++}`);
                params.push(campos.qtdMinEstoque);
            }

            if (sets.length === 0) {
                return false;
            }

            const query = `
                UPDATE produto
                   SET ${sets.join(", ")}
                 WHERE id_produto = $${idx}
                 RETURNING id_produto;
            `;
            params.push(idProduto);

            const result = await database.query(query, params);
            return result.rows.length > 0;
        } catch (error) {
            console.error(`Erro ao atualizar produto: ${error}`);
            return false;
        }
    }

    // DELETE
   // DELETE - Remove referências em item_venda e depois remove o produto
    static async removerProduto(idProduto: number): Promise<boolean> {
        try {
            // 1. Remove os vínculos em item_venda
            const queryDeleteItens = `DELETE FROM item_venda WHERE id_produto = $1;`;
            await database.query(queryDeleteItens, [idProduto]);

            // 2. Remove o produto da tabela produto
            const queryDeleteProduto = `DELETE FROM produto WHERE id_produto = $1;`;
            const result = await database.query(queryDeleteProduto, [idProduto]);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Erro ao remover produto: ${error}`);
            return false;
        }
    }
}