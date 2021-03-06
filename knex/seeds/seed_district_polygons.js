const geojson=require("/home/bhoomik/Desktop/pyshp-demo.json");
const rewind = require("@mapbox/geojson-rewind");


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('District_Polygons').del()
    .then(function () {
      try{
      const knexPostgis = require('knex-postgis');
      const st = knexPostgis(knex);
      let data=[];
      const districtData=geojson["features"]
      console.log(districtData.length);
      for(var i=0;i<districtData.length;i++){
        const districtProperties = districtData[i]["properties"];
    
        var geom={ };
        
        if(districtData[i]["geometry"]["type"]==="Polygon"){
          geom={
            "type":"MultiPolygon",
            "coordinates":[districtData[i]["geometry"]["coordinates"]]
          }
        }else{
          geom=districtData[i]["geometry"]
        }
        const multiFixed = rewind(geom);
        const geomFromGeoJSON=st.geomFromGeoJSON(multiFixed,4326);

        const tobeadded={
          "state":districtProperties["statename"].toLowerCase(),
          "district":districtProperties["distname"]==="DATA NOT AVAILABLE"?"leh":districtProperties["distname"].toLowerCase(),
          "geometry":geomFromGeoJSON
        }
        data.push(tobeadded);
      }
      console.log(data)
      return knex('District_Polygons').insert(data);
    }catch(e){
      console.log(e)
    }
    });
};
