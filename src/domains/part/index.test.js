const R = require('ramda')

const EquipTypeDomain = require('../equip/equipType')
const PartDomain = require('./')

const { FieldValidationError } = require('../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()


describe('partDomain', () => {
  let partMock = null
  let equipModelMock = null
  let equipModelMock1 = null
  let equipMarkMock = null

  beforeAll(async () => {
    equipMarkMock = {
      type: 'catraca',
      mark: 'Samsung',
      responsibleUser: 'modrp',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    equipModelMock = {
      equipMarkId: markMock.id,
      model: 'Samsung 2.0',
      description: '',
      responsibleUser: 'modrp',
    }
    equipModelMock1 = {
      equipMarkId: markMock.id,
      model: 'Samsung 3.0',
      description: '',
      responsibleUser: 'modrp',
    }

    const modelMock = await equipTypeDomain.addModel(equipModelMock)
    const modelMock1 = await equipTypeDomain.addModel(equipModelMock1)

    partMock = {
      item: 'displayyyy',
      description: 'adsd',
      costPrice: '100,00',
      salePrice: '150,00',
      equipModels: [{ id: modelMock.id }, { id: modelMock1.id }],
      responsibleUser: 'modrp',
    }
  })


  test('create', async () => {
    const partCreated = await partDomain.add(partMock)

    expect(partCreated.item).toBe(partMock.item)
    expect(partCreated.descripinon).toBe(partMock.descripinon)
    expect(partCreated.costPrice).toBe('10000')
    expect(partCreated.salePrice).toBe('15000')
    expect(partCreated.obsolete).toBe(false)

    await expect(partDomain.add(partMock))
      .rejects.toThrowError(new FieldValidationError())
  })

  test('updateByCostPrince', async () => {
    partMock.item = 'mouse'
    const partCreated = await partDomain.add(partMock)
    const newCostPrince = '500,00'
    const partUpdated = await partDomain.updateByCostPrince(partCreated.id, { newCostPrince })

    expect(partUpdated.item).toBe(partCreated.item)
    expect(partUpdated.descripinon).toBe(partCreated.descripinon)
    expect(partUpdated.costPrice).toBe('50000')
    expect(partUpdated.salePrice).toBe(partCreated.salePrice)
  })


  test('updateBySalePrice', async () => {
    partMock.item = 'tecla'
    const partCreated = await partDomain.add(partMock)
    const newSalePrice = '550,00'
    const partUpdated = await partDomain.updateBySalePrice(partCreated.id, { newSalePrice })

    expect(partUpdated.item).toBe(partCreated.item)
    expect(partUpdated.descripinon).toBe(partCreated.descripinon)
    expect(partUpdated.costPrice).toBe(partCreated.costPrice)
    expect(partUpdated.salePrice).toBe('55000')
  })


  test('try add part with item null', async () => {
    const partCreated = partMock
    partCreated.item = ''

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'item',
        message: 'item cannot be null',
      }]))
  })


  test('try add part without item', async () => {
    const partCreated = R.omit(['item'], partMock)

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'item',
        message: 'item cannot be null',
      }]))
  })

  test('try add part with costPrice null', async () => {
    const partCreated = partMock
    partCreated.costPrice = ''

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'costPrice',
        message: 'costPrice cannot be null',
      }]))
  })


  test('try add part without costPrice', async () => {
    const partCreated = R.omit(['costPrice'], partMock)

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'costPrice',
        message: 'costPrice cannot be null',
      }]))
  })

  test('try add part with salePrice null', async () => {
    const partCreated = partMock
    partCreated.salePrice = ''

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'salePrice',
        message: 'salePrice cannot be null',
      }]))
  })


  test('try add part without salePrice', async () => {
    const partCreated = R.omit(['salePrice'], partMock)

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'salePrice',
        message: 'salePrice cannot be null',
      }]))
  })

  test('try add part with equipModels null', async () => {
    const partCreated = partMock
    partCreated.equipModels = []

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'equipModels',
        message: 'equipModels cannot be null',
      }]))
  })


  test('try add part without equipModels', async () => {
    const partCreated = R.omit(['equipModels'], partMock)

    await expect(partDomain.add(partCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'equipModels',
        message: 'equipModels cannot be null',
      }]))
  })

  test('getAll', async () => {
    const parts = await partDomain.getAllParts()
    expect(parts.rows.length > 0).toBeTruthy()
  })
})
