import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      startDate: '@date',
      endDate: '@date',
      storeId: '@integer(1, 50)',
      date: '@date',
      sum: '@integer(0, 500)',
      singlePerson: '@integer(0, 500)',
      manyPerson: '@integer(0, 500)',
      manySum: '@integer(0, 500)',
      manyChildren: '@integer(0, 500)',
      manyWoman: '@integer(0, 500)',
      manyMan: '@integer(0, 500)',
      manyOther: '@integer(0, 500)'
    })
  )
}

export default {
  query: config => {
    const { page = 1, size = 10 } = param2Obj(config.url)
    console.log(page, size)

    const pageList = List.filter(
      (item, index) => index < size * page && index >= size * (page - 1)
    )

    return {
      total: List.length,
      data: pageList
    }
  }
}
