$(document).ready(function () { 

  $("#demo-remote").wijgrid({
    data: new wijdatasource({
        proxy: new wijhttpproxy({
            url: "/sites/nico",
            dataType: "json",
            data: {
                // featureClass: "P",
                // style: "full",
                // maxRows: 5,
                // name_startsWith: "ab"
            }
            // ,
            // key: "geonames"
        }),
        reader: new wijarrayreader([
         { name: "id", mapping: "_id"},
         { name: "customer", mapping: "customer" },
         { name: "site name", mapping: "nom" },
         { name: "urls", mapping: "urls" }
      ])
    })
}); 
  
});