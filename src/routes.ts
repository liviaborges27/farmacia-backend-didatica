import { Router } from "express";
import type { Request, Response } from "express";
import ProdutoController from "./controller/ProdutoController.js";
import PedidoController from "./controller/PedidoController.js";
import ItemPedidoController from "./controller/ItemPedidoController.js";
import ClienteController from "./controller/ClienteController.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Olá, seja bem-vindo!" });
});

// CLIENTES
router.get("/clientes", ClienteController.todos);
router.get("/clientes/:idCliente", ClienteController.obter);
router.post("/clientes", ClienteController.novo);
router.put("/clientes/:idCliente", ClienteController.atualizar);
router.delete("/clientes/:idCliente", ClienteController.remover);

// PRODUTOS
router.get("/produtos", ProdutoController.todos);
router.get("/produtos/alerta", ProdutoController.alerta);
router.get("/produtos/:idProduto", ProdutoController.obter);
router.post("/produtos", ProdutoController.novo);
router.put("/produtos/:idProduto", ProdutoController.atualizar);
router.delete("/produtos/:idProduto", ProdutoController.remover);

// PEDIDOS
router.get("/pedidos", PedidoController.todos);
router.get("/pedidos/:id/itens", PedidoController.itens);
router.post("/pedidos/:id/itens", PedidoController.novoItem);
router.get("/pedidos/:id", PedidoController.obter);
router.post("/pedidos", PedidoController.novo);

// ITENS DO PEDIDO
router.get("/itens/:idVenda", ItemPedidoController.todos);
router.post("/itens", ItemPedidoController.novo);
router.put("/itens/:idVenda/:idProduto", ItemPedidoController.atualizar);
router.delete("/itens/:idVenda/:idProduto", ItemPedidoController.remover);

export { router };