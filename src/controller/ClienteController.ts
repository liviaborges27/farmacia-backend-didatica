import { Cliente } from "../model/Cliente.js";
import type { Request, Response } from "express";
import type { ClienteDTO } from "../dto/ClienteDTO.js";

class ClienteController extends Cliente {

    // LISTAR TODOS
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaClientes: Array<Cliente> | null = await Cliente.listarClientes();
            return res.status(200).json(listaClientes);

        } catch (error) {
            console.error(`Erro ao consultar modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possivel acessar a lista de clientes." });
        }
    }

    // OBTER POR ID
    static async obter(req: Request, res: Response): Promise<Response> {
        try {
            const idCliente = Number(req.params.idCliente);
            const cliente: Cliente | null = await Cliente.obterClientePorId(idCliente);

            if (cliente) {
                return res.status(200).json(cliente);
            } else {
                return res.status(404).json({ mensagem: "Cliente não encontrado." });
            }

        } catch (error) {
            console.error(`Erro ao consultar cliente por ID. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível buscar o cliente." });
        }
    }

    // CADASTRAR NOVO
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: ClienteDTO = req.body;
            
            // Instancia a classe Cliente com base nos dados do DTO
            const novoCliente = new Cliente(dadosRecebidos.nome, dadosRecebidos.cpf);

            const respostaModelo = await Cliente.cadastrarCliente(novoCliente);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Cliente cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar cliente." });
            }

        } catch (error) {
            console.error(`Erro no modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível inserir o cliente." });
        }
    }

    // ATUALIZAR
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idCliente = Number(req.params.idCliente);
            const dadosRecebidos: ClienteDTO = req.body;

            const clienteAtualizado = new Cliente(dadosRecebidos.nome, dadosRecebidos.cpf);
            clienteAtualizado.setIdCliente(idCliente);

            const respostaModelo = await Cliente.atualizarCliente(clienteAtualizado);

            if (respostaModelo) {
                return res.status(200).json({ mensagem: "Cliente atualizado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar o cliente." });
            }

        } catch (error) {
            console.error(`Erro no modelo ao atualizar cliente. ${error}`);
            return res.status(500).json({ mensagem: "Erro interno ao atualizar cliente." });
        }
    }

    // REMOVER
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idCliente = Number(req.params.idCliente);
            const respostaModelo = await Cliente.removerCliente(idCliente);

            if (respostaModelo) {
                return res.status(200).json({ mensagem: "Cliente removido com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível remover o cliente." });
            }

        } catch (error) {
            console.error(`Erro no modelo ao remover cliente. ${error}`);
            return res.status(500).json({ mensagem: "Erro interno ao remover cliente." });
        }
    }
}

export default ClienteController;