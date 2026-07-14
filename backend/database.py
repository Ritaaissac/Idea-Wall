import pymysql

def conectar():
    return pymysql.connect(
        host="localhost",
        user="root",               
        password="1234",          
        database="idea_wall",      
        port=3306               
    )

def criar_tabela():
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios(
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
    )
    """)

    conn.commit()
    conn.close()