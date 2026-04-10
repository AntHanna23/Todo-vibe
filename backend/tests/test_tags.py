def test_create_tag(client):
    res = client.post("/tags", json={"name": "work"})
    assert res.status_code == 201
    assert res.json()["name"] == "work"


def test_create_duplicate_tag(client):
    client.post("/tags", json={"name": "work"})
    res = client.post("/tags", json={"name": "work"})
    assert res.status_code == 409


def test_get_tags(client):
    client.post("/tags", json={"name": "work"})
    client.post("/tags", json={"name": "personal"})
    res = client.get("/tags")
    assert res.status_code == 200
    names = [t["name"] for t in res.json()]
    assert "work" in names
    assert "personal" in names


def test_delete_tag(client):
    tag = client.post("/tags", json={"name": "temp"}).json()
    res = client.delete(f"/tags/{tag['id']}")
    assert res.status_code == 204
    tags = client.get("/tags").json()
    assert not any(t["id"] == tag["id"] for t in tags)


def test_delete_tag_not_found(client):
    res = client.delete("/tags/999")
    assert res.status_code == 404


def test_todo_with_tag(client):
    tag = client.post("/tags", json={"name": "work"}).json()
    todo = client.post("/todos", json={"title": "Work task", "tag_id": tag["id"]}).json()
    assert todo["tag_id"] == tag["id"]
    assert todo["tag"]["name"] == "work"


def test_filter_todos_by_tag(client):
    tag = client.post("/tags", json={"name": "home"}).json()
    client.post("/todos", json={"title": "Home task", "tag_id": tag["id"]})
    client.post("/todos", json={"title": "Untagged task"})

    res = client.get(f"/todos?tag_id={tag['id']}")
    assert res.status_code == 200
    todos = res.json()
    assert len(todos) == 1
    assert todos[0]["title"] == "Home task"
