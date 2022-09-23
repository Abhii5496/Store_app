

class whereClause{
    constructor(base, bigQ){
    this.base = base;
    this.bigQ = bigQ
}

    search(){
        const searchWord = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $option:'i'
            }
        } : {}

        this.base = this.base.find({...searchWord})
        return this;
    }

    filter(){
        const copyQ = {...this.bigQ}

        delete copyQ['search']
        delete copyQ['limit']
        delete copyQ['page']

        //convet bigq into string

        let stringOfCopyQ = JSON.stringify(copyQ)

        stringOfCopyQ= stringOfCopyQ.replace(/\b(gte|lte|lt|gt)/g ,m => `$$(m)`)

        let jsonOfCopyQ = JSON.parse(stringOfCopyQ)

        this.base =this.base.find(jsonOfCopyQ)
        return this;
    }

    pager(resultPerPage){

        let currentPage =1
        if(this.bigQ.page){
            currentPage = this.bigQ.page
        }

        const skipVal= resultPerPage * (currentPage-1)

        this.base = this.base.limit(resultPerPage).skip(skipVal)
        return this;
    }

}

module.exports = whereClause