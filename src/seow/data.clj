(ns seow.data 
 (:import [org.joda.time DateTime])
 (:require [clojure.data.json :as json])
 ; monger
 (:use monger.operators)
 (:require [monger.joda-time])
 (:require [monger.collection :as mc])
 (:require [monger.core :as mg]))

; time to move to monger
; Monger [1] has several things Congomongo does not (or did not last time I looked at it):

; * No integration of clj-time (transparent Joda Time types serialization)
; * No integration with clojure.data.json
; * No query DSL à la Korma
; * No recommended way of validating your data

; http://clojuremongodb.info/articles/getting_started.html
; http://localhost:28017/mydb/robots/

; records 
(defrecord website [customer nom urls])
(defrecord filtre [siteid keywords])
(defrecord entry [filtreid date values])

; connection set up
(def conn  (mg/connect! { :host "127.0.0.1" :port 27017 }))
(mg/set-db! (mg/get-db "mydb"))

; clean
(defn clean-mess[]
	(mc/remove :seo)
	(mc/remove :websites))
(defn delete[type id]
	(mc/remove type id))

; website
(defn new-website[customer sitename urls]
	(mc/insert-and-return :websites (website. customer sitename urls)))
; filters 
(defn new-filtre[siteid keywords]
	(mc/insert :filters (filtre. siteid keywords)))
(defn filtre-for-site[siteid]
	(mc/find-maps :filters {:siteid siteid}))
; seo entries
(defn new-entry[filtreid values]
	(mc/insert :seo (entry. filtreid (DateTime/now) values)))

; search
(defn find-entries
	([date-start date-end]
	(mc/find-maps :seo {:date {"$gt" date-start "$lte" date-end}}))
	([date-start]
		(mc/find-maps :seo {:date {"$gt" date-start}})))	
(defn yesterday[]
	(find-entries (.minusDays (DateTime/now) 1) (.minusDays (DateTime/now) 2) ))
(defn today[] 
	(find-entries (.minusDays (DateTime/now) 1) ))

; commented

; (def entry1 (entry. "508f49ab3004f21368c81fe0" (DateTime/now) ))
; (new-entry "508f49ab3004f21368c81fe0" {:google [1 2] :bing [3 5]})

; (filtre-for-site "508f4b8e3004f21368c81fe1")

; (def filtre1 (filtre. "508f4b8e3004f21368c81fe1" ["nico"]))
; (mc/insert :filters filtre1)


; (mc/insert :websites site1)

; (mc/find-maps :websites)
; (mc/find-maps :websites  {:name "日本語"})
; (mc/remove :websites {:_id "508e42643004943cb0c3c9f4"})

; (def site1 (website. 1 "日本語"  ["www.touchesthewall.net" "touchesthewall.org"]))