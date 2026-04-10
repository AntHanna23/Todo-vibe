import pytest


def test_create_todo(client):
    res = client.post("/todos", json={"title": "Buy milk"})
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Buy milk"
    assert data["status"] == "incomplete"
    assert data["id"] is not None


def test_create_todo_missing_title(client):
    res = client.post("/todos", json={})
    assert res.status_code == 422


def test_get_todos_empty(client):
    res = client.get("/todos")
    assert res.status_code == 200
    assert res.json() == []


def test_get_todos(client):
    client.post("/todos", json={"title": "First"})
    client.post("/todos", json={"title": "Second"})
    res = client.get("/todos")
    assert res.status_code == 200
    assert len(res.json()) == 2


def test_get_todo(client):
    created = client.post("/todos", json={"title": "Get me"}).json()
    res = client.get(f"/todos/{created['id']}")
    assert res.status_code == 200
    assert res.json()["title"] == "Get me"


def test_get_todo_not_found(client):
    res = client.get("/todos/999")
    assert res.status_code == 404


def test_update_todo(client):
    created = client.post("/todos", json={"title": "Original"}).json()
    res = client.put(f"/todos/{created['id']}", json={"title": "Updated", "status": "complete"})
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Updated"
    assert data["status"] == "complete"


def test_update_todo_invalid_status(client):
    created = client.post("/todos", json={"title": "Test"}).json()
    res = client.put(f"/todos/{created['id']}", json={"status": "invalid"})
    assert res.status_code == 422


def test_delete_todo(client):
    created = client.post("/todos", json={"title": "Delete me"}).json()
    res = client.delete(f"/todos/{created['id']}")
    assert res.status_code == 204
    assert client.get(f"/todos/{created['id']}").status_code == 404


def test_filter_todos_by_status(client):
    client.post("/todos", json={"title": "Incomplete"})
    todo = client.post("/todos", json={"title": "Complete"}).json()
    client.put(f"/todos/{todo['id']}", json={"status": "complete"})

    incomplete = client.get("/todos?status=incomplete").json()
    complete = client.get("/todos?status=complete").json()

    assert all(t["status"] == "incomplete" for t in incomplete)
    assert all(t["status"] == "complete" for t in complete)


def test_todo_with_priority(client):
    res = client.post("/todos", json={"title": "Urgent", "priority": "high"})
    assert res.status_code == 201
    assert res.json()["priority"] == "high"


def test_todo_invalid_priority(client):
    res = client.post("/todos", json={"title": "Bad", "priority": "urgent"})
    assert res.status_code == 422
