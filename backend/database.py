import sqlite3

def conectar():
    return sqlite3.connect("usuarios.db")

def criar_tabela():

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    )
    """)

    conn.commit()
    conn.close()