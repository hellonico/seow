(ns seow.data
 (:use somnium.congomongo))

(def conn 
	(make-connection "mydb" :host "127.0.0.1" :port 27017))

; http://localhost:28017/mydb/robots/
(set-connection! conn)
(insert! :robots {:name "robby" :date (java.util.Date.)})