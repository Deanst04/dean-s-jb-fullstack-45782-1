import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Category from "./category";

@Table({
    underscored: true
})
export default class Product extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number

    @AllowNull(false)
    @Column(DataType.STRING(30))
    name: string

    @AllowNull(false)
    @Column(DataType.DATE)
    manufactureDate: Date

    @AllowNull(false)
    @Column(DataType.DATE)
    expirationDate: Date

    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    categoryId: number

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    price: number

    @BelongsTo(() => Category, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    category: Category
}