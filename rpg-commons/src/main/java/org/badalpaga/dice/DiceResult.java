package org.badalpaga.dice;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * User: Hello-Gitty
 * Date: 19/06/11
 * Time: 17:15.
 */
public class DiceResult {

    protected Map<String, Collection<Integer>> dicesResult;

    public DiceResult() {
        this.dicesResult = new HashMap<String, Collection<Integer>>();
    }

     public void put (String name, Collection<Integer> val) {
        dicesResult.put(name,val);
     }

}
