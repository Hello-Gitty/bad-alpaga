package org.badalpaga.org.badalpaga.dice;

import java.util.ArrayList;

/**
 * User: Hello-Gitty
 * Date: 19/06/11
 * Time: 16:55.
 */
public class HeadTailDice extends AbstractDice<String>{

    protected ArrayList<String> values;

    public HeadTailDice(String name) {
        super(name);
        values.add(1,"head");
        values.add(2,"tail");
    }

    @Override
    public boolean isNumeric() {
        return false;

    }

    @Override
    public String getFace(int face) {
        return values.get(face);
    }

    @Override
    public int getDiceFacesNumber() {
        return 2;
    }
}
