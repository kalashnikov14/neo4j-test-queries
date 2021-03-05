<template>
  <div id="app">
  <button @click="connect()">Connect</button>
  <button @click="testQuery()">Connect</button>
  </div>
</template>

<script>
export default {
  name: 'App',

  data(){
    return{
      protocol: 'bolt',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'admin',
      text: 'Petro',
      propObject: {
        title: 'fourth add',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic nisi possimus ratione sint?',
        top: true,
        id: '1',
        src: [
          {imageURL: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'},
          {imageURL: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'},
        ],
        show: false,
        liked: false,
        sellerName: 'Vasil',
        phone: '434343453',
        cost: 23345345,
        city:'Kyiv',
        residentialComplex: 'test',
        constructionType: 'govno i palki',
        heatingType: 'pechka na drovah',
        condition: 'for renovation',
        warmingType: 'mineral wool',
        layoutType: '3-room',
        closedArea: true,
        parking: false,
        ceilingH: 43.435,
        storeyNum: 324,
        costForM2: 234,
        areaM2: 324,
      },
    }
  },
  methods: {
    connect() {
      return this.$neo4j.connect(this.protocol, this.host, this.port, this.username, this.password)
      // .then(driver => {
      //   // Update the context of your app
      // })
    },
    driver() {
      // Get a driver instance
      return this.$neo4j.getDriver()
    },
    testQuery() {
      // Get a session from the driver
      let obj = this.propObject
      const session = this.$neo4j.getSession()
      // Or you can just call this.$neo4j.run(cypher, params)
      session.run(
          "MATCH (b: City {name: $city})" +
          "MATCH (c: LayoutType {name: $layoutType})" +
          "CREATE (a:Property {title:$title, description:$description})-[:IN_CITY]->(b), (a)-[:LAYOUT]->(c)",
          {
            title: obj.title,
            description: obj.description,
            city: obj.city,
            condition: obj.condition,
            warmingType: obj.warmingType,
            layoutType: obj.layoutType,
            closedArea: obj.closedArea,
            parking: obj.parking,
            ceilingH: obj.ceilingH,
            storeyNum: obj.storeyNum,
            costForM2: obj.costForM2,
            areaM2: obj.areaM2,

          }
      )
          .then( ()=>
          {
            return session.run( "MATCH (a:Property) WHERE a.title = $title RETURN a.title AS title, a.description AS description",
                {
                  title: obj.title
                }
            )
          })
          .then( function( result ) {
            console.log( result.records[0].get("title") + " " + result.records[0].get("description") );
            session.close();
          });
    }
  }
}
</script>
