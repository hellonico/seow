(ns seow.data
 (:import [java.util Date])
 (:use somnium.congomongo))

(def conn 
	(make-connection "mydb" :host "127.0.0.1" :port 27017))

; http://localhost:28017/mydb/robots/

(set-connection! conn)

(def website {
	:urls ["www.touchesthewall.net" "touchesthewall.org"]
	:keywords [
		["nico" "touches"]
		["nico"]
		["chocolate nico"]
	]
})

(insert! :websites website)
(fetch-one :websites :_id "508e263f3004157c921d9408")

(def entry {
	:date (Date.)
	:websiteId "508e263f3004157c921d9408"
	:keywords ["nico" "touches"]
	:values {
		:google [1 2]
		:bing [3 5]
	}})

(insert! :seo entry)
(fetch :seo :where {:date {:$lt (java.util.Date.)}})

; lower than a date
((fetch-one :seo :where {:date {:$lt (java.util.Date.)}}) :date)

; fetch one interval