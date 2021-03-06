const R = require('ramda')

const TypeAccountDomain = require('./')

const { FieldValidationError } = require('../../../helpers/errors')

const typeAccountDomain = new TypeAccountDomain()

describe('typeAccountDomain', () => {
  let typeAccountMock = null

  beforeAll(() => {
    typeAccountMock = {
      typeName: 'Adm',
      addCompany: true,
      addPart: true,
      addAnalyze: true,
      addEquip: false,
      addEntry: false,
      addEquipType: false,
      tecnico: false,
      addAccessories: false,
      addUser: false,
      addTypeAccount: false,
      responsibleUser: 'modrp',
    }
  })

  test('create', async () => {
    const typeAccountCreated = await typeAccountDomain.add(typeAccountMock)

    expect(typeAccountCreated.typeName).toBe(typeAccountMock.typeName)
    expect(typeAccountCreated.resource.addCompany).toBe(typeAccountMock.addCompany)
    expect(typeAccountCreated.resource.addPart).toBe(typeAccountMock.addPart)
    expect(typeAccountCreated.resource.addAnalyze).toBe(typeAccountMock.addAnalyze)
    expect(typeAccountCreated.resource.addEquip).toBe(false)
    expect(typeAccountCreated.resource.addEntry).toBe(false)

    await expect(typeAccountDomain.add(typeAccountMock))
      .rejects.toThrowError(new FieldValidationError())
  })

  test('try add typeAccount with typeName null', async () => {
    const typeAccountCreated = typeAccountMock
    typeAccountCreated.typeName = ''

    await expect(typeAccountDomain.add(typeAccountCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'typeName',
        message: 'typeName cannot be null',
      }]))
  })


  test('try add typeAccount without typeName', async () => {
    const typeAccountCreated = R.omit(['typeName'], typeAccountMock)

    await expect(typeAccountDomain.add(typeAccountCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'typeName',
        message: 'typeName cannot be null',
      }]))
  })

  test('getAll', async () => {
    const typeAccounts = await typeAccountDomain.getAll()
    expect(typeAccounts.rows.length > 0).toBeTruthy()
  })

  test('getResourcesByTypeAccount', async () => {
    const typeAccount = await typeAccountDomain.getResourcesByTypeAccount('Adm')

    expect(typeAccount.typeName).toBe('Adm')
    expect(typeAccount.addCompany).toBe(true)
    expect(typeAccount.addPart).toBe(true)
    expect(typeAccount.addAnalyze).toBe(true)
    expect(typeAccount.addEquip).toBe(false)
    expect(typeAccount.addEntry).toBe(false)
  })
})
