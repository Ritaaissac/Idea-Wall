"""criar tabela tarefas

Revision ID: c1a2b3c4d5e6
Revises: 0a903b3138b2
Create Date: 2026-09-10
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c1a2b3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "0a903b3138b2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Criar tabela tarefas."""

    op.create_table(
        "tarefas",

        sa.Column(
            "id",
            sa.Integer(),
            autoincrement=True,
            nullable=False
        ),

        sa.Column(
            "titulo",
            sa.String(length=255),
            nullable=False
        ),

        sa.Column(
            "data",
            sa.String(length=50),
            nullable=True
        ),

        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False
        ),

        sa.Column(
            "quadro_id",
            sa.Integer(),
            nullable=False
        ),

        sa.Column(
            "criado_em",
            sa.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=True
        ),

        sa.PrimaryKeyConstraint("id"),

        sa.ForeignKeyConstraint(
            ["quadro_id"],
            ["quadros.id"],
            ondelete="CASCADE"
        )
    )


def downgrade() -> None:
    """Remover tabela tarefas."""

    op.drop_table("tarefas")