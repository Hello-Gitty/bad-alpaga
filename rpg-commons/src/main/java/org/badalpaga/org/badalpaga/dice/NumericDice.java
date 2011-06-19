package org.badalpaga.org.badalpaga.dice;

/**
 * User: Hello-Gitty
 * Date: 19/06/11
 * Time: 16:50.
 */
public class NumericDice extends AbstractDice<Integer>{

    protected int nbFaces;


    public NumericDice(String name, int nbFace) {
        super(name);
    }

    @Override
    public boolean isNumeric() {
        return true;
    }

    @Override
    public Integer getFace(int face) {
        return face;
    }

    @Override
    public int getDiceFacesNumber() {
        return nbFaces;
    }
}
