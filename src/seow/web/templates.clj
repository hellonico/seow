(ns seow.web.templates
	(:use [net.cgrand.enlive-html 
		:only [defsnippet deftemplate at content set-attr attr? strict-mode]]))

; snippets 
(defsnippet welcome-template "seow/html/welcome.html" [:body]  [])
(defsnippet new-template "seow/html/new2.html" [:div#top] [])
(defsnippet chart-template "seow/html/chart.html" [:body] [])

; templates
(deftemplate main "seow/html/main.html" [body] [:div#body] (content body))
(deftemplate angular "seow/html/angular.html" [])