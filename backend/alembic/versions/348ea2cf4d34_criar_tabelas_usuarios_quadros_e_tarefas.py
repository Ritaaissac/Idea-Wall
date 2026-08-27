"""criar tabelas usuarios quadros e tarefas

Revision ID: 348ea2cf4d34
Revises:
Create Date: 2026-08-26 19:46:41.865422

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '348ea2cf4d34'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'usuarios',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('nome', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('senha', sa.String(length=255), nullable=False),
        sa.Column('foto', sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    op.create_table(
        'quadros',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('nome', sa.String(length=255), nullable=False),
        sa.Column('usuario_id', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['usuario_id'],
            ['usuarios.id'],
            ondelete='CASCADE'
        )
    )

    op.create_table(
        'tarefas',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('titulo', sa.String(length=255), nullable=False),
        sa.Column('data', sa.String(length=50), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('quadro_id', sa.Integer(), nullable=False),
        sa.Column(
            'criado_em',
            sa.TIMESTAMP(),
            server_default=sa.text('CURRENT_TIMESTAMP'),
            nullable=True
        ),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['quadro_id'],
            ['quadros.id'],
            ondelete='CASCADE'
        )
    )


def downgrade() -> None:
    op.drop_table('tarefas')
    op.drop_table('quadros')
    op.drop_table('usuarios')