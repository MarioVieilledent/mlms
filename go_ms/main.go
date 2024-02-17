package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Message defines the structure of the message
type Message struct {
	ID    string `json:"id"`
	Data  string `json:"data"`
	Color string `json:"color"`
}

var messages []Message = []Message{}

func main() {
	router := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	router.GET("/message", getAllMessages)
	router.POST("/message", createMessage)
	router.PUT("/message/:id", updateMessage)

	router.Run(":4001")
}

func getAllMessages(c *gin.Context) {
	c.JSON(http.StatusOK, messages)
}

func createMessage(c *gin.Context) {
	var newMessage Message

	if err := c.BindJSON(&newMessage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message format"})
		return
	}

	messages = append(messages, newMessage)

	c.JSON(http.StatusOK, gin.H{"message": "OK"})
}

func updateMessage(c *gin.Context) {
	id := c.Param("id")

	var updatedMessage Message

	if err := c.BindJSON(&updatedMessage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message format"})
		return
	}

	for i, msg := range messages {
		if msg.ID == id {
			messages[i] = updatedMessage
			c.JSON(http.StatusOK, gin.H{"message": "OK"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
}
