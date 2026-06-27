from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from ..deps import get_db
from ...services.inbox_service import (
    get_inbox_items,
    get_inbox_item,
    create_inbox_item,
    update_inbox_item,
    delete_inbox_item,
)
from ...schemas.inbox_item import InboxItemCreate, InboxItemRead, InboxItemUpdate

router = APIRouter(prefix="/inbox", tags=["inbox"])


@router.get("/", response_model=list[InboxItemRead])
def list_inbox_items(db: Session = Depends(get_db)):
    return get_inbox_items(db)


@router.post("/", response_model=InboxItemRead)
def create_new_inbox_item(item_in: InboxItemCreate, db: Session = Depends(get_db)):
    return create_inbox_item(db, item_in)


@router.get("/{inbox_item_id}", response_model=InboxItemRead)
def read_inbox_item(inbox_item_id: UUID, db: Session = Depends(get_db)):
    item = get_inbox_item(db, inbox_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return item


@router.patch("/{inbox_item_id}", response_model=InboxItemRead)
def update_existing_inbox_item(inbox_item_id: UUID, item_in: InboxItemUpdate, db: Session = Depends(get_db)):
    item = get_inbox_item(db, inbox_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return update_inbox_item(db, item, item_in)


@router.delete("/{inbox_item_id}")
def delete_existing_inbox_item(inbox_item_id: UUID, db: Session = Depends(get_db)):
    item = get_inbox_item(db, inbox_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    delete_inbox_item(db, item)
    return {"detail": "Inbox item deleted"}
