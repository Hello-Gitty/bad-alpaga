package org.badalpaga.org.badalpaga.dice;

import java.security.PrivateKey;

/**
 * User: Hello-Gitty
 * Date: 19/06/11
 * Time: 16:28
 */
public interface Dice<E> {

    /**
     *
     * @return the name of the dice
     */
    public String getName();

    /**
     *
     * @return if the dice have numeric value
     */
    public boolean isNumeric();

    /**
     *
     * @param face the requested face
     * @return the value of the request face
     */
    public E getFace(int face);

    /**
     *
     * @return the number of faces of this dice
     */
    public int getDiceFacesNumber();


}
