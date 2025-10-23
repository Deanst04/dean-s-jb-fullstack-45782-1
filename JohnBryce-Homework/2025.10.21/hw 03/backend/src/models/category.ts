import { AllowNull, AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Product from "./product";

@Table({
    underscored: true
})
export default class Category extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number

    @AllowNull(false)
    @Column(DataType.STRING(20))
    name: string

    @HasMany(() => Product, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    products: Product[]
}