package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import model.Produto;
import model.Categoria;
import util.ConnectionFactory;

public class ProdutoDAO {

    public List<Produto> buscarTodos() {
        List<Produto> produtos = new ArrayList<>();

        String sql = "SELECT p.id, p.nome, p.preco, p.estoque, " +
                     "c.id as id_categoria, c.nome as nome_categoria " +
                     "FROM produtos p " +
                     "LEFT JOIN categorias c ON p.id_categoria = c.id";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Categoria categoria = null;
                Long idCategoria = rs.getLong("id_categoria");

                if (!rs.wasNull()) {
                    categoria = new Categoria(idCategoria, rs.getString("nome_categoria"));
                }

                Produto produto = new Produto(
                        rs.getLong("id"),
                        rs.getString("nome"),
                        rs.getDouble("preco"),
                        rs.getInt("estoque"),
                        categoria
                );

                produtos.add(produto);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return produtos;
    }

    public Produto buscarPorId(Long id) {

        Produto produto = null;

        String sql = "SELECT p.id, p.nome, p.preco, p.estoque, " +
                     "c.id as id_categoria, c.nome as nome_categoria " +
                     "FROM produtos p " +
                     "LEFT JOIN categorias c ON p.id_categoria = c.id " +
                     "WHERE p.id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Categoria categoria = null;
                    Long idCategoria = rs.getLong("id_categoria");

                    if (!rs.wasNull()) {
                        categoria = new Categoria(idCategoria, rs.getString("nome_categoria"));
                    }

                    produto = new Produto(
                            rs.getLong("id"),
                            rs.getString("nome"),
                            rs.getDouble("preco"),
                            rs.getInt("estoque"),
                            categoria
                    );
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return produto;
    }

    public void inserir(Produto produto) {

        String sql = "INSERT INTO produtos (nome, preco, estoque, id_categoria) VALUES (?, ?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, produto.getNome());
            stmt.setDouble(2, produto.getPreco());
            stmt.setInt(3, produto.getEstoque());

            if (produto.getCategoria() != null && produto.getCategoria().getId() != null) {
                stmt.setLong(4, produto.getCategoria().getId());
            } else {
                stmt.setNull(4, java.sql.Types.BIGINT);
            }

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    produto.setId(rs.getLong(1));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void atualizar(Produto produto) {

        String sql = "UPDATE produtos SET nome = ?, preco = ?, estoque = ?, id_categoria = ? WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, produto.getNome());
            stmt.setDouble(2, produto.getPreco());
            stmt.setInt(3, produto.getEstoque());

            if (produto.getCategoria() != null && produto.getCategoria().getId() != null) {
                stmt.setLong(4, produto.getCategoria().getId());
            } else {
                stmt.setNull(4, java.sql.Types.BIGINT);
            }

            stmt.setLong(5, produto.getId());

            int linhas = stmt.executeUpdate();
            System.out.println("Linhas atualizadas: " + linhas);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deletar(Long id) {

        String sql = "DELETE FROM produtos WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
