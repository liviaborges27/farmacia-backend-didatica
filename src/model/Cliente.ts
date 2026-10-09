import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Cliente {
  private idCliente?: number;  
  private nome: string;
  private cpf: string;

  constructor( _nome: string, _cpf: string) {    
    this.nome = _nome;
    this.cpf = _cpf;
  }

  // ========== GETTERS ==========
  public getIdCliente(): number | undefined { return this.idCliente; }
  public getCpf(): string { return this.cpf; }
  public getNome(): string { return this.nome; }

  // ========== SETTERS ==========
  public setIdCliente(_idCliente: number): void { this.idCliente = _idCliente; }
  public setCpf(_cpf: string): void { this.cpf = _cpf; }
  public setNome(_nome: string): void { this.nome = _nome; }

  // READ - LISTAR TODOS
  static async listarClientes(): Promise<Array<Cliente> | null> {
    try {
      let listaDeClientes: Array<Cliente> = [];
      const querySelectClientes = `SELECT * FROM cliente;`;

      const respostaBD = await database.query(querySelectClientes);

      respostaBD.rows.forEach((clienteBD) => {
        const novoCliente: Cliente = new Cliente(
          clienteBD.nome,
          clienteBD.cpf
        );

        novoCliente.setIdCliente(clienteBD.id_cliente);
        listaDeClientes.push(novoCliente);
      });

      return listaDeClientes;
    } catch (error) {
      console.error(`Erro na consulta ao banco de dados: ${error}`);
      return null;
    }
  }

  // READ - OBTER POR ID
  static async obterClientePorId(idCliente: number): Promise<Cliente | null> {
    try {
      const querySelectCliente = `SELECT * FROM cliente WHERE id_cliente = $1;`;
      const respostaBD = await database.query(querySelectCliente, [idCliente]);

      if (respostaBD.rows.length > 0) {
        const clienteBD = respostaBD.rows[0];
        const clienteEncontrado = new Cliente(clienteBD.nome, clienteBD.cpf);
        clienteEncontrado.setIdCliente(clienteBD.id_cliente);
        return clienteEncontrado;
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar cliente por ID no banco de dados: ${error}`);
      return null;
    }
  }

  // CREATE - CADASTRAR
  static async cadastrarCliente(cliente: Cliente): Promise<boolean> {
    try {
      const queryInsertCliente = `INSERT INTO Cliente (nome, cpf)
        VALUES ( $1, $2)      
        RETURNING id_cliente;`;
        
      const result = await database.query(queryInsertCliente, [
        cliente.nome.toUpperCase(),
        cliente.cpf
      ]);

      if (result.rows.length > 0) {
        console.log(`Cliente cadastrado com sucesso. ID: ${result.rows[0].id_cliente}`);
        return true;
      }

      return false;

    } catch (error) {
      console.error(`Erro ao cadastrar cliente: ${error}`);
      return false;
    }
  }

  // UPDATE - ATUALIZAR
  static async atualizarCliente(cliente: Cliente): Promise<boolean> {
    try {
      const queryUpdateCliente = `UPDATE cliente 
        SET nome = $1, cpf = $2 
        WHERE id_cliente = $3;`;

      const result = await database.query(queryUpdateCliente, [
        cliente.nome.toUpperCase(),
        cliente.cpf,
        cliente.idCliente
      ]);

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error(`Erro ao atualizar cliente: ${error}`);
      return false;
    }
  }

  // DELETE - REMOVER
  static async removerCliente(idCliente: number): Promise<boolean> {
    try {
      const queryDeleteCliente = `DELETE FROM cliente WHERE id_cliente = $1;`;
      const result = await database.query(queryDeleteCliente, [idCliente]);

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error(`Erro ao remover cliente: ${error}`);
      return false;
    }
  }
}