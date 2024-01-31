# Notebook End Points

## login
#### post : url/login
```json
{
  "email" : "string",
  "pass" : "string"
}
```

## register
#### post : url/register
```json
{
  "name": "string",
  "email": "string",
  "pass": "string"
}
```

## notes
#### get : url/notes
```json 
{
  "status": true,
  "message": "done !",
  "data": [
    [
      {
        "id": "string",
        "email": "string",
        "title": "string",
        "content": "string",
        "time": 1705934961744
      }
    ]
  ],
  "count": 2
}
```

## add note
#### post : url/add_note
```json
{
  "title" : "string",
  "content" : "string"
}
```

## remove note
#### post : url/remove_note
```json
{
  "id" : "string"
}
```