import pymysql

def conectar():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="1234",
        database="idea_wall",
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )

def criar_tabelas():
    conn = conectar()
    cursor = conn.cursor()

    # Tabela de Usuários
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios(
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        foto LONGTEXT
    )
    """)

    # Tabela de Quadros (com chave estrangeira para o usuário)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quadros(
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        icone VARCHAR(50) NOT NULL,
        usuario_id INT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()

def salvar_quadro(titulo, descricao, icone, usuario_id):
    conn = conectar()
    cursor = conn.cursor()

    sql = """
    INSERT INTO quadros (titulo, descricao, icone, usuario_id)
    VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (titulo, descricao, icone, usuario_id))

    conn.commit()
    quadro_id = cursor.lastrowid
    conn.close()

    return quadro_id