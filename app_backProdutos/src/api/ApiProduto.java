package api;

import static spark.Spark.*;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Filter;
import dao.CategoriaDAO;
import dao.ProdutoDAO;
import model.Categoria;
import model.Produto;
import com.google.gson.Gson;

public class ApiProduto {

    // Instâncias do DAO e o GSON
    private static final ProdutoDAO dao = new ProdutoDAO();
    private static final CategoriaDAO categoriaDAO = new CategoriaDAO();
    private static final Gson gson = new Gson();

    // Constante para garantir que todas as respostas sejam em JSON
    private static final String APPLICATION_JSON = "application/json";

    public static void main(String[] args) {

        // Configuração do Servidor
        port(4567); // Definindo a porta da API (http://localhost:4567)

        // Filtro para permitir CORS (Cross-Origin Resource Sharing)
        before((request, response) -> {
            // Permitindo todas as origens (você pode especificar um domínio específico no lugar de "*")
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

            // Preflight request (resposta à requisição OPTIONS)
            if ("OPTIONS".equalsIgnoreCase(request.requestMethod())) {
                response.status(200);
                response.body(""); // Corpo vazio para requisição OPTIONS
            }
        });

        // Filtro para definir tipo de resposta como JSON
        after(new Filter() {
            @Override
            public void handle(Request request, Response response) {
                response.type(APPLICATION_JSON);
            }
        });

        // GET /produtos - Buscar todos
        get("/produtos", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                return gson.toJson(dao.buscarTodos());
            }
        });

        // GET /produtos/:id - Buscar por ID
        get("/produtos/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    Long id = Long.parseLong(request.params(":id"));
                    Produto produto = dao.buscarPorId(id);

                    if (produto != null) {
                        return gson.toJson(produto);
                    } else {
                        response.status(404); // Not Found
                        return "{\"mensagem\": \"Produto com ID " + id + " não encontrado\"}";
                    }
                } catch (NumberFormatException e) {
                    response.status(400); // Bad Request
                    return "{\"mensagem\": \"Formato de ID inválido.\"}";
                }
            }
        });

        // POST /produtos - Criar novo produto
        post("/produtos", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    Produto novoProduto = gson.fromJson(request.body(), Produto.class);
                    dao.inserir(novoProduto);

                    response.status(201); // Created
                    return gson.toJson(novoProduto);
                } catch (Exception e) {
                    response.status(500);
                    System.err.println("Erro ao processar requisição POST: " + e.getMessage());
                    e.printStackTrace();
                    return "{\"mensagem\": \"Erro ao criar produto.\"}";
                }
            }
        });

        // PUT /produtos/:id - Atualizar produto existente
        put("/produtos/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    Long id = Long.parseLong(request.params(":id"));

                    if (dao.buscarPorId(id) == null) {
                        response.status(404);
                        return "{\"mensagem\": \"Produto não encontrado para atualização.\"}";
                    }

                    Produto produtoParaAtualizar = gson.fromJson(request.body(), Produto.class);
                    produtoParaAtualizar.setId(id); // Garante que o ID da URL seja usado

                    dao.atualizar(produtoParaAtualizar);

                    response.status(200); // OK
                    return gson.toJson(produtoParaAtualizar);

                } catch (NumberFormatException e) {
                    response.status(400); // Bad Request
                    return "{\"mensagem\": \"Formato de ID inválido.\"}";
                } catch (Exception e) {
                    response.status(500);
                    e.printStackTrace();
                    return "{\"mensagem\": \"Erro ao atualizar produto.\"}";
                }
            }
        });

        // DELETE /produtos/:id - Deletar um produto
        delete("/produtos/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    Long id = Long.parseLong(request.params(":id"));

                    if (dao.buscarPorId(id) == null) {
                        response.status(404);
                        return "{\"mensagem\": \"Produto não encontrado para exclusão.\"}";
                    }

                    dao.deletar(id);

                    response.status(204); // No Content
                    return "";

                } catch (NumberFormatException e) {
                    response.status(400);
                    return "{\"mensagem\": \"Formato de ID inválido.\"}";
                }
            }
        });

        // GET /categorias - Buscar todas
        get("/categorias", (request, response) -> gson.toJson(categoriaDAO.buscarTodos()));

        // GET /categorias/:id - Buscar por ID
        get("/categorias/:id", (request, response) -> {
            try {
                Long id = Long.parseLong(request.params(":id"));
                Categoria categoria = categoriaDAO.buscarPorId(id);

                if (categoria != null) {
                    return gson.toJson(categoria);
                } else {
                    response.status(404); // Not Found
                    return "{\"mensagem\": \"Categoria com ID " + id + " não encontrada\"}";
                }
            } catch (NumberFormatException e) {
                response.status(400); // Bad Request
                return "{\"mensagem\": \"Formato de ID inválido.\"}";
            }
        });

        // POST /categorias - Criar nova categoria
        post("/categorias", (request, response) -> {
            try {
                Categoria novaCategoria = gson.fromJson(request.body(), Categoria.class);
                categoriaDAO.inserir(novaCategoria);

                response.status(201); // Created
                return gson.toJson(novaCategoria);
            } catch (Exception e) {
                response.status(500);
                e.printStackTrace();
                return "{\"mensagem\": \"Erro ao criar categoria.\"}";
            }
        });

        // PUT /categorias/:id - Atualizar categoria
        put("/categorias/:id", (request, response) -> {
            try {
                Long id = Long.parseLong(request.params(":id"));

                if (categoriaDAO.buscarPorId(id) == null) {
                    response.status(404);
                    return "{\"mensagem\": \"Categoria não encontrada para atualização.\"}";
                }

                Categoria categoriaParaAtualizar = gson.fromJson(request.body(), Categoria.class);
                categoriaParaAtualizar.setId(id);

                categoriaDAO.atualizar(categoriaParaAtualizar);

                response.status(200); // OK
                return gson.toJson(categoriaParaAtualizar);

            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"mensagem\": \"Formato de ID inválido.\"}";
            } catch (Exception e) {
                response.status(500);
                e.printStackTrace();
                return "{\"mensagem\": \"Erro ao atualizar categoria.\"}";
            }
        });

        // DELETE /categorias/:id - Deletar categoria
        delete("/categorias/:id", (request, response) -> {
            try {
                Long id = Long.parseLong(request.params(":id"));

                if (categoriaDAO.buscarPorId(id) == null) {
                    response.status(404);
                    return "{\"mensagem\": \"Categoria não encontrada para exclusão.\"}";
                }

                categoriaDAO.deletar(id);

                response.status(204); // No Content
                return "";

            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"mensagem\": \"Formato de ID inválido.\"}";
            } catch (Exception e) {
                if (e.getCause() instanceof java.sql.SQLIntegrityConstraintViolationException) {
                    response.status(409); // Conflict
                    return "{\"mensagem\": \"Não é possível excluir a categoria. Ela está sendo usada por um ou mais produtos.\"}";
                }
                response.status(500);
                e.printStackTrace();
                return "{\"mensagem\": \"Erro ao deletar categoria.\"}";
            }
        });

        System.out.println("API de Produtos iniciada na porta 4567.");
    }
}
