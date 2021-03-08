<template>
  <div id="app">
    <div>
  <button @click="connect()">Connect</button>
  <button @click="testQuery()">Connect</button>
      <br>
      <br>
      <button @click="results()">results</button>
      <br>
      <button @click="log()">log</button>
    </div>
    <div>
      <br>
      title: {{output.title}}
      <br>
      seller: {{output.sellerName}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      output: {},
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
          "MATCH (b: City {name: $data.city})" +
          "MATCH (c: WarmingType {name: $data.warmingType})" +
          "MATCH (d: HeatingType {name: $data.heatingType})" +
          "MATCH (e: ConstructionType {name: $data.constructionType})" +
          "MATCH (f: Condition {name: $data.condition})" +
          "MATCH (g: LayoutType {name: $data.layoutType})" +
          "CREATE (a:Property {title:$data.title," +
          "description:$data.description," +
          "cost:$data.cost," +
          "residentialComplex: $data.residentialComplex," +
          "ceilingH: $data.ceilingH," +
          "closedArea:$data.closedArea," +
          "parking:$data.parking," +
          "storeyNum:$data.storeyNum," +
          "show:$data.show," +
          "liked:$data.liked," +
          "top:$data.top," +
          "id:$data.id," +
          "sellerName:$data.sellerName," +
          "phone:$data.phone," +
          "areaM2:$data.areaM2" +
          "})-[:IN_CITY]->(b)," +
          "(a)-[:WARMING_TYPE]->(c)," +
          "(a)-[:HEATING_TYPE]->(d)," +
          "(a)-[:CONSTRUCTION_TYPE]->(e)," +
          "(a)-[:CONDITION]->(f)," +
          "(a)-[:LAYOUT]->(g)",
          {
            data : obj
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
    },
    async results(){
      const session = this.$neo4j.getSession()
      let receiver = null
      await session.run("match(n:Property) return n")
      .then(function (result){
        let outArr = []
        console.log(result.records[0]._fields[0].identity.low)
        outArr = result.records[0]._fields[0].properties
        console.log(outArr)
        receiver = outArr
      })
      .catch(function (err){
        console.log(err)
      })

       this.output = receiver
    },
    log(){
      console.log(this.output)
    },
    pusher(x){
      return this.output = x
    }
  }
}
</script>
