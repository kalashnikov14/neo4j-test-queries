<template>
  <div id="app">
    <div>
<!--  <button @click="connect()">Connect</button>-->
  <button @click="testQuery()">Connect</button>
      <br>
      <br>
      <br>
      <button @click="log()">log</button>
      <br>
    </div>
    <div v-for="n in output"
         :key="n">
      <br>
      title: {{n.title}}
      <br>
      seller: {{n.sellerName}}
    </div>
  </div>

</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      image: null,
      output: [],
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

  mounted() {
    this.$neo4j.connect(this.protocol, this.host, this.port, this.username, this.password)
    const session = this.$neo4j.getSession()

    const vm = this
    session.run("match(n:Property) return n")
        .then(function (result){
          let outArr = []
          console.log(result)
          console.log(result.records[0]._fields[0].identity.low)
          for (let i = 0; i < result.records.length; i++){
            outArr.push(result.records[i]._fields[0].properties)
          }
          console.log(outArr)
          vm.$store.dispatch('addData', outArr)
          vm.output = vm.$store.getters['getDbLog']
        })
        .catch(function (err){
          console.log(err)
        })

  },

  methods: {

    driver() {
      // Get a driver instance
      return this.$neo4j.getDriver()
    },
   async testQuery() {
      const vm = this
      // Get a session from the driver
      let obj = this.propObject
      const session = this.$neo4j.getSession()
      // Or you can just call this.$neo4j.run(cypher, params)
     await session.run(
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
            return session.run("match(n:Property) return n")
          })
         .then(function (result){
           let outArr = []
           console.log(result)
           console.log(result.records[0]._fields[0].identity.low)
           for (let i = 0; i < result.records.length; i++){
             outArr.push(result.records[i]._fields[0].properties)
           }
           vm.$store.dispatch('addData', outArr)
           vm.output = vm.$store.getters['getDbLog']
         })
         .catch(function (err){
           console.log(err)
         })
    },
    // async results(){
    //   const session = this.$neo4j.getSession()
    //   let receiver = null
    //   await session.run("match(n:Property) return n")
    //   .then(function (result){
    //     let outArr = []
    //     console.log(result.records[0]._fields[0].identity.low)
    //     for (let i = 0; i < result.records.length; i++){
    //     outArr.push(result.records[i]._fields[0].properties)
    //     console.log(outArr)
    //     }
    //     receiver = outArr
    //   })
    //   .catch(function (err){
    //     console.log(err)
    //   })
    //
    //    this.output = receiver
    //   console.log(this.output)
    // },
    log(){
      console.log(this.$store.getters['getDbLog'])
    },
  }
}
</script>
<style scoped>
</style>
