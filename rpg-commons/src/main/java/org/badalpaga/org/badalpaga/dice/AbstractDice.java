package org.badalpaga.org.badalpaga.dice;

/**
 * User: Hello-Gitty
 * Date: 19/06/11
 * Time: 16:43
 */
public abstract class AbstractDice<E> implements Dice<E>{

    protected String name;

    public String getName() {
        return name;
    }

     public void setName(String name) {
        this.name=name;
    }

    protected AbstractDice(String name) {
        this.name = name;
    }

    public abstract boolean isNumeric();

    public abstract E getFace(int face);

    public abstract int getDiceFacesNumber();
}
