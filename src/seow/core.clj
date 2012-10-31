(ns seow.core
  (:use seow.engines)
  (:use seow.utils)
  (:use [clojure.tools.logging :only (info error)])
  (:require [seow.data.mongo :as data])
  (:use jsoup.soup)
  (:use clojure.pprint)
  (:require [clj-http.client :as client]))

; http://www.blueglass.com/blog/google-search-url-parameters-query-string-anatomy/

; constants
(def user-agent 
	"Mozilla/5.0 (Windows; U; WindowsNT 5.1; ja-JP; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")

; prepare the query string
(defn query-string[target words]
	(str (target :base) (client/generate-query-string ((target :query) words))))
; run the query
(defn run[target keywords]
 (client/get (query-string target keywords)
  {:client-params {"http.useragent" user-agent }}))
; suppose we have an answer with no error
(defn fetch[target keywords]
	((run target keywords) :body))
; turn answer into something ready to be parsed
(defn fetch-doc[target keywords]
	(parse (fetch target keywords)))
; apply selector and clean up each element found
(defn lookup[target docme]
	(map (target :clean) (select (target :selector) docme)))
; top method to execute a query with given keywords
(defn query[target keywords]
	(lookup target (fetch-doc target keywords)))
; position a site in a result set. returns a list of index matching the map	
(defn score[site result]
	(positions #{true} (pmap #(.contains % site) result)))
(defn scores[site keywords engines]
	(zipmap engines (pmap #(score site (query (targets %) keywords)) engines)))
(defn all-scores[site keywords]
  (info "SCORING" site keywords)
	(scores site keywords (keys targets)))

; workflow
(defn update-score-filtre 
  "Add a new entry for all the scores of that filter for the given url"
  [url filtre]
  (let[keywords-string (clojure.string/join " " (:keywords filtre))]
    (data/new-entry 
       (str (filtre :_id)) 
       (all-scores url keywords-string))))

(defn update-score
  "Update the score for all filters of the given website"
  [web-id]
  (let [
    website (data/find-website web-id)
    filtres (data/find-filtres web-id)
    ]
    (doseq [f filtres] 
       (update-score-filtre (-> website :urls first) f))))



; testing
(def target (ref (targets :fresheye)))

(defn q[keywords] (query @target keywords))
(defn p[keywords] (pprint (q keywords)))
(defn d[keywords] (fetch-doc @target keywords))
(defn p[keywords t] (pprint (query (targets t) keywords)))
(defn q[keywords t] (query (targets t) keywords))

; find website

; (def my-websites  (data/find-websites "nico"))
; (def my-w1 (first my-websites))
; (def my-w1-id (str (:_id my-w1)))
; (update-score my-w1-id)
