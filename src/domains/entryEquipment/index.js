const R = require('ramda')
const Cpf = require('@fnando/cpf/dist/node')

// const formatQuery = require('../../helpers/lazyLoad')

const database = require('../../database')
const EquipDomain = require('../equip')

const { FieldValidationError } = require('../../helpers/errors')

const equipDomain = new EquipDomain()

const EntryEquipment = database.model('entryEquipment')
const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')
const Company = database.model('company')
const Equip = database.model('equip')


module.exports = class EntryEquipmentDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const entryEquipment = R.omit(['id', 'serialNumber'], bodyData)

    const entryEquipmentNotHasProp = prop => R.not(R.has(prop, entryEquipment))
    const bodyDataNotHasProp = prop => R.not(R.has(prop, bodyData))


    const field = {
      equipId: false,
      externalDamage: false,
      delivery: false,
    }
    const message = {
      equipId: '',
      externalDamage: '',
      delivery: '',
    }

    let errors = false

    const { serialNumber } = bodyData

    let equipReturned = ''

    if (bodyDataNotHasProp('serialNumber') || !bodyData.serialNumber) {
      errors = true
      field.serialNumber = true
      message.serialNumber = 'Por favor digite o número de série.'
    } else {
      equipReturned = await equipDomain.getOneBySerialNumber(serialNumber)

      if (!equipReturned) {
        errors = true
        field.serialNumber = true
        message.serialNumber = 'Este equipamento não está registrado.'
      }
    }

    entryEquipment.equipId = equipReturned.id

    if (entryEquipmentNotHasProp('externalDamage')) {
      errors = true
      field.externalDamage = true
      message.externalDamage = 'Selecione sim ou não.'
    } else if (entryEquipment.externalDamage && !entryEquipment.details) {
      errors = true
      field.details = true
      message.details = 'Digite os danos externos.'
    }

    if (entryEquipmentNotHasProp('defect') || !entryEquipment.defect) {
      errors = true
      field.defect = true
      message.defect = 'Por favor informar o defeito.'
    }

    const client = () => {
      if (entryEquipmentNotHasProp('clientName') || !entryEquipment.clientName) {
        errors = true
        field.clientName = true
        message.clientName = 'Por favor informar o nome do cliente.'
      }
      if (entryEquipmentNotHasProp('RG') || !entryEquipment.RG) {
        errors = true
        field.Rg = true
        message.Rg = 'Por favor informar o RG.'
      }
      if (entryEquipmentNotHasProp('Cpf') || !entryEquipment.Cpf) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Por favor informar o Cpf.'
      } else if (!Cpf.isValid(entryEquipment.Cpf)) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Cpf inválido.'
      }
    }

    const sedex = () => {
      if (entryEquipmentNotHasProp('senderName') || !entryEquipment.senderName) {
        errors = true
        field.senderName = true
        message.senderName = 'Por favor informar o nome do remetente.'
      }
      if (entryEquipmentNotHasProp('properlyPacked') || !entryEquipment.properlyPacked) {
        errors = true
        field.properlyPacked = true
        message.properlyPacked = 'Por favor informar se está devidamente embalado.'
      }
      if (entryEquipmentNotHasProp('zipCode') || !entryEquipment.zipCode) {
        errors = true
        field.zipCode = true
        message.zipCode = 'Por favor informar o Cep.'
      }
      if (entryEquipmentNotHasProp('state') || !entryEquipment.state) {
        errors = true
        field.state = true
        message.state = 'Por favor informar o estado.'
      }
      if (entryEquipmentNotHasProp('city') || !entryEquipment.city) {
        errors = true
        field.city = true
        message.city = 'Por favor informar a cidade.'
      }
      if (entryEquipmentNotHasProp('neighborhood') || !entryEquipment.neighborhood) {
        errors = true
        field.neighborhood = true
        message.neighborhood = 'Por favor informar o bairro.'
      }
      if (entryEquipmentNotHasProp('street') || !entryEquipment.street) {
        errors = true
        field.street = true
        message.street = 'Por favor informar a rua.'
      }
      if (entryEquipmentNotHasProp('number') || !entryEquipment.number) {
        errors = true
        field.number = true
        message.number = 'Por favor informar o número.'
      }
    }

    const motoboy = () => {
      if (entryEquipmentNotHasProp('motoboyName') || !entryEquipment.motoboyName) {
        errors = true
        field.motoboyName = true
        message.motoboyName = 'Por favor informar o nome do motoboy.'
      }
      if (entryEquipmentNotHasProp('RG') || !entryEquipment.RG) {
        errors = true
        field.Rg = true
        message.Rg = 'Por favor informar o RG.'
      }
      if (entryEquipmentNotHasProp('Cpf') || !entryEquipment.Cpf) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Por favor informar o Cpf.'
      } else if (!Cpf.isValid(entryEquipment.Cpf)) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Cpf inválido.'
      }
      if (entryEquipmentNotHasProp('responsibleName') || !entryEquipment.responsibleName) {
        errors = true
        field.responsibleName = true
        message.responsibleName = 'Por favor informar o nome do responsável.'
      }
      if (entryEquipmentNotHasProp('properlyPacked') || !entryEquipment.properlyPacked) {
        errors = true
        field.properlyPacked = true
        message.properlyPacked = 'Por favor informar se está devidamente embalado.'
      }
    }

    const externalTechnician = () => {
      if (entryEquipmentNotHasProp('technicianName') || !entryEquipment.technicianName) {
        errors = true
        field.technicianName = true
        message.technicianName = 'Por favor informar o nome do técnico externo.'
      }
      if (entryEquipmentNotHasProp('properlyPacked') || !entryEquipment.properlyPacked) {
        errors = true
        field.properlyPacked = true
        message.properlyPacked = 'Por favor informar se está devidamente embalado.'
      }
    }

    if (entryEquipmentNotHasProp('delivery')
      || (entryEquipment.delivery !== 'Cliente'
      && entryEquipment.delivery !== 'Sedex'
      && entryEquipment.delivery !== 'Motoboy'
      && entryEquipment.delivery !== 'Técnico externo')) {
      errors = true
      field.delivery = true
      message.delivery = 'Por favor informar como chegou.'
    } else if (entryEquipment.delivery === 'Cliente') {
      client()
    } else if (entryEquipment.delivery === 'Sedex') {
      sedex()
    } else if (entryEquipment.delivery === 'Motoboy') {
      motoboy()
    } else if (entryEquipment.delivery === 'Técnico externo') {
      externalTechnician()
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const entryEquipmentCreated = await EntryEquipment.create(entryEquipment, { transaction })

    const response = await EntryEquipment.findByPk(entryEquipmentCreated.id, {
      include: [
        {
          model: Equip,
          include: [
            {
              model: Company,
            },
            {
              model: EquipModel,
              include: [{
                model: EquipMark,
                include: [{
                  model: EquipType,
                }],
              }],
            },
          ],
        },
      ],
      transaction,
    })
    return response
  }
}