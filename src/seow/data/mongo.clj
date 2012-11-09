(ns seow.data.mongo
 (:import [org.joda.time DateTime])
 (:import org.bson.types.ObjectId)
 (:require [clojure.data.json :as json])
 (:use monger.operators)
 (:use [clojure.tools.logging :only (info error)])
 (:require [monger.joda-time])
 (:require [monger.collection :as mc])
 (:require [monger.core :as mg]))

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
(defn new-website[website]
	(mc/insert-and-return :websites (dissoc website :_id)))
(defn find-websites[customer]
	(mc/find-maps :websites {:customer customer}))
(defn find-website[id]
	(mc/find-one-as-map :websites {:_id (ObjectId. id)}))
(defn update-website[website]
	(mc/update-by-id :websites 
		(ObjectId. (website :_id)) 
		(dissoc website :_id)))
(defn update-or-new[website]
	(if(= "0" (website :_id)) 
		(new-website website)
		(update-website website)))
(defn delete-website[id]
	(mc/remove-by-id :websites (ObjectId. id)))

; filters 
(defn new-filtre[siteid keywords]
	(mc/insert :filters (filtre. siteid keywords)))
(defn find-filtres[siteid]
	(mc/find-maps :filters {:siteid siteid}))

; seo entries
(defn new-entry[filtreid values]
	(info "NEW" filtreid values)
	(mc/insert :seo (entry. filtreid (DateTime/now) values)))

(defn find-entries
	([fid date-start date-end]
		(mc/find-maps :seo {:filtreid fid :date {"$gt" date-start "$lte" date-end}}))
	([fid date-start]
		(mc/find-maps :seo {:filtreid fid :date {"$gt" date-start}}))
	([fid]
		(mc/find-maps :seo {:filtreid fid})))	

; shortcuts
(defn yesterday[fid]
	(find-entries (.minusDays (DateTime/now) 1) (.minusDays (DateTime/now) 2) ))
(defn today[fid] 
	(find-entries fid (.minusDays (DateTime/now) 1) ))
(defn twoweeks[fid]
	(find-entries fid))