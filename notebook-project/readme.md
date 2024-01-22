# Notebook End Points

## login
```json
{
  "email" : "string",
  "pass" : "string"
}
```

## register
```json
{
  "name": "string",
  "email": "string",
  "pass": "string"
}
```

## notes
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
```json
{
  "title" : "string",
  "content" : "string"
}
```

## delete note
```json
{
  "id" : "string"
}
```