(defproject seow "1.0.0-SNAPSHOT"
  :description "Prototype for seo"
  :main seow.server
  :plugins [[lein-ring "0.7.5"]]
  :ring {:handler seow.server/handler}
  :dependencies [
   [noir "1.3.0-beta2"]
   [org.clojure/clojure "1.4.0"]
   [clojure-soup/clojure-soup "0.0.1"]
   [clj-http "0.1.3"]
   [com.novemberain/monger "1.3.1"]
   [clj-time "0.4.4"]   
   [cheshire "4.0.3"]
   [org.clojure/data.json "0.1.3"]
   [org.clojure/tools.logging "0.2.3"]
   [enlive "1.0.1"]])