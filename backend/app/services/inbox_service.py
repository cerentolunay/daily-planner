from sqlalchemy.orm import Session
from uuid import UUID
from ..models.inbox_item import InboxItem
from ..schemas.inbox_item import InboxItemCreate, InboxItemUpdate


def get_inbox_items(db: Session):
    return db.query(InboxItem).all()


def get_inbox_item(db: Session, inbox_item_id: UUID):
    return db.query(InboxItem).filter(InboxItem.id == inbox_item_id).first()


def create_inbox_item(db: Session, inbox_item_in: InboxItemCreate):
    item = InboxItem(**inbox_item_in.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_inbox_item(db: Session, item: InboxItem, inbox_item_in: InboxItemUpdate):
    for field, value in inbox_item_in.dict(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_inbox_item(db: Session, item: InboxItem):
    db.delete(item)
    db.commit()
