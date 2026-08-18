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

    cursor.close()
    conn.close()

    return quadro_id