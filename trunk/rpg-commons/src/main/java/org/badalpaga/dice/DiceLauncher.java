package org.badalpaga.dice;


import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

/**
 * User: Hello-Gitty
 * Date: 19/06/11
 * Time: 17:15.
 */
public class DiceLauncher {

    protected Map<Dice,Integer> dices;

    public DiceLauncher() {
        dices = new HashMap<Dice,Integer>();
    }

    public void addDice(Dice d, int number){
        dices.put(d, number);
    }

    public DiceResult launch(){
        DiceResult result = new DiceResult();
        int lower = 1;


        for (Map.Entry<Dice,Integer> en :dices.entrySet()) {

            LinkedList<Integer> valResult = new LinkedList<Integer>();

            for(int i=0;i<en.getValue(); i++) {
                Double temp = Math.random();
                temp = temp *  (en.getKey().getDiceFacesNumber()+1)-lower;
                temp += lower;

                valResult.add(temp.intValue());
            }
            result.put(en.getKey().getName(),valResult);
        }


    return result;
    }

}
